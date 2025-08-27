// src/routes/tasks.js
const express = require('express');
const router = express.Router();
const { supabase } = require('../config/database');

// GET /api/tasks?project_id=1 - Get all tasks for a project, grouped by status
router.get('/', async (req, res) => {
  try {
    const { project_id } = req.query;

    if (!project_id) {
      return res.status(400).json({
        success: false,
        error: 'project_id query parameter is required'
      });
    }

    // Get all tasks for the project
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', project_id)
      .order('created_at', { ascending: false });

    if (tasksError) {
      console.error('Supabase error:', tasksError);
      return res.status(400).json({
        success: false,
        error: tasksError.message
      });
    }

    // Get assignees for all tasks
    const tasksWithAssignees = await Promise.all(
      (tasks || []).map(async (task) => {
        const { data: assignees, error: assigneesError } = await supabase
          .from('task_assignees')
          .select(`
            users (
              id,
              name,
              avatar
            )
          `)
          .eq('task_id', task.id);

        if (assigneesError) {
          console.error('Error fetching assignees:', assigneesError);
          return {
            ...task,
            assignees: [],
            assignee_details: []
          };
        }

        const assigneeDetails = assignees?.map(a => a.users) || [];
        const assigneeIds = assigneeDetails.map(a => a.id);

        return {
          ...task,
          assignees: assigneeIds,
          assignee_details: assigneeDetails
        };
      })
    );

    // Group tasks by status
    const groupedTasks = {
      todo: tasksWithAssignees.filter(t => t.status === 'todo'),
      'in-progress': tasksWithAssignees.filter(t => t.status === 'in-progress'),
      completed: tasksWithAssignees.filter(t => t.status === 'completed')
    };

    res.json({
      success: true,
      data: groupedTasks
    });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
});

// GET /api/tasks/:id - Get single task with assignees
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (taskError || !task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Get task assignees
    const { data: assignees, error: assigneesError } = await supabase
      .from('task_assignees')
      .select(`
        users (
          id,
          name,
          avatar
        )
      `)
      .eq('task_id', id);

    if (assigneesError) {
      console.error('Error fetching assignees:', assigneesError);
    }

    const assigneeDetails = assignees?.map(a => a.users) || [];
    const assigneeIds = assigneeDetails.map(a => a.id);

    const taskWithAssignees = {
      ...task,
      assignees: assigneeIds,
      assignee_details: assigneeDetails
    };

    res.json({
      success: true,
      data: taskWithAssignees
    });
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task'
    });
  }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res) => {
  try {
    const {
      project_id,
      title,
      description,
      status = 'todo',
      category = 'DESIGN',
      category_color = 'badge-info',
      border_color = 'border-amber-300',
      assignees = []
    } = req.body;

    // Validation
    if (!project_id || !title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'project_id and title are required'
      });
    }

    // Validate status
    const validStatuses = ['todo', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: todo, in-progress, or completed'
      });
    }

    // Create the task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert([
        {
          project_id,
          title: title.trim(),
          description: description?.trim() || null,
          status,
          category,
          category_color,
          border_color
        }
      ])
      .select()
      .single();

    if (taskError) {
      console.error('Supabase error:', taskError);
      return res.status(400).json({
        success: false,
        error: taskError.message
      });
    }

    // Assign users to the task if provided
    if (assignees.length > 0) {
      const assigneeInserts = assignees.map(user_id => ({
        task_id: task.id,
        user_id
      }));

      const { error: assigneeError } = await supabase
        .from('task_assignees')
        .insert(assigneeInserts);

      if (assigneeError) {
        console.error('Error assigning users:', assigneeError);
      }
    }

    // Update project task count properly
    const { data: currentProject, error: projectError } = await supabase
      .from('projects')
      .select('task_count')
      .eq('id', project_id)
      .single();

    if (!projectError && currentProject) {
      await supabase
        .from('projects')
        .update({ task_count: (currentProject.task_count || 0) + 1 })
        .eq('id', project_id);
    }

    // Get the created task with assignees
    const { data: assignees_data } = await supabase
      .from('task_assignees')
      .select(`
        users (
          id,
          name,
          avatar
        )
      `)
      .eq('task_id', task.id);

    const assigneeDetails = assignees_data?.map(a => a.users) || [];
    const assigneeIds = assigneeDetails.map(a => a.id);

    const taskWithAssignees = {
      ...task,
      assignees: assigneeIds,
      assignee_details: assigneeDetails
    };

    res.status(201).json({
      success: true,
      data: taskWithAssignees
    });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      category,
      category_color,
      border_color,
      assignees
    } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (status !== undefined) {
      const validStatuses = ['todo', 'in-progress', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status. Must be: todo, in-progress, or completed'
        });
      }
      updates.status = status;
    }
    if (category !== undefined) updates.category = category;
    if (category_color !== undefined) updates.category_color = category_color;
    if (border_color !== undefined) updates.border_color = border_color;
    updates.updated_at = new Date().toISOString();

    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (taskError) {
      console.error('Supabase error:', taskError);
      return res.status(400).json({
        success: false,
        error: taskError.message
      });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Update assignees if provided
    if (assignees !== undefined && Array.isArray(assignees)) {
      // Remove existing assignees
      await supabase
        .from('task_assignees')
        .delete()
        .eq('task_id', id);

      // Add new assignees
      if (assignees.length > 0) {
        const assigneeInserts = assignees.map(user_id => ({
          task_id: id,
          user_id
        }));

        const { error: assigneeError } = await supabase
          .from('task_assignees')
          .insert(assigneeInserts);

        if (assigneeError) {
          console.error('Error updating assignees:', assigneeError);
        }
      }
    }

    // Get updated task with assignees
    const { data: assignees_data } = await supabase
      .from('task_assignees')
      .select(`
        users (
          id,
          name,
          avatar
        )
      `)
      .eq('task_id', id);

    const assigneeDetails = assignees_data?.map(a => a.users) || [];
    const assigneeIds = assigneeDetails.map(a => a.id);

    const taskWithAssignees = {
      ...task,
      assignees: assigneeIds,
      assignee_details: assigneeDetails
    };

    res.json({
      success: true,
      data: taskWithAssignees
    });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update task'
    });
  }
});

// PATCH /api/tasks/:id/status - Move task to different status (for drag & drop)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['todo', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: todo, in-progress, or completed'
      });
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error('Error moving task:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to move task'
    });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get task to know which project to update
    const { data: task, error: getError } = await supabase
      .from('tasks')
      .select('project_id')
      .eq('id', id)
      .single();

    if (getError || !task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    // Update project task count
    await supabase
      .from('projects')
      .update({ task_count: supabase.sql`GREATEST(task_count - 1, 0)` })
      .eq('id', task.project_id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete task'
    });
  }
});

module.exports = router;