// src/routes/projects.js
const express = require('express');
const router = express.Router();
const { supabase } = require('../config/database');

// GET /api/projects - Get all projects with members
router.get('/', async (req, res) => {
  try {
    // Get projects - NO query parameter needed here
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectsError) {
      console.error('Supabase error:', projectsError);
      return res.status(400).json({
        success: false,
        error: projectsError.message
      });
    }

    // Get members for each project and calculate task count
    const projectsWithMembers = await Promise.all(
      (projects || []).map(async (project) => {
        // Get members
        const { data: members, error: membersError } = await supabase
          .from('project_members')
          .select(`
            users (
              id,
              name,
              avatar
            )
          `)
          .eq('project_id', project.id);

        // Get actual task count
        const { count: taskCount } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', project.id);

        if (membersError) {
          console.error('Error fetching members:', membersError);
        }

        return {
          ...project,
          task_count: taskCount || 0,
          taskCount: taskCount || 0, // Add both formats for compatibility
          members: members?.map(m => m.users) || []
        };
      })
    );

    res.json({
      success: true,
      data: projectsWithMembers
    });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    });
  }
});

// GET /api/projects/:id - Get single project with members
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Get project members
    const { data: members, error: membersError } = await supabase
      .from('project_members')
      .select(`
        users (
          id,
          name,
          avatar
        )
      `)
      .eq('project_id', id);

    if (membersError) {
      console.error('Error fetching members:', membersError);
    }

    const projectWithMembers = {
      ...project,
      members: members?.map(m => m.users) || []
    };

    res.json({
      success: true,
      data: projectWithMembers
    });
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project'
    });
  }
});

// POST /api/projects - Create new project
router.post('/', async (req, res) => {
  try {
    const { title, description, color } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert([
        {
          title: title.trim(),
          description: description?.trim() || null,
          color: color || 'bg-warning',
          task_count: 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    // Return project with empty members array
    const projectWithMembers = {
      ...project,
      members: []
    };

    res.status(201).json({
      success: true,
      data: projectWithMembers
    });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, color, task_count } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (color !== undefined) updates.color = color;
    if (task_count !== undefined) updates.task_count = task_count;
    updates.updated_at = new Date().toISOString();

    const { data: project, error } = await supabase
      .from('projects')
      .update(updates)
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

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update project'
    });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
    });
  }
});

// POST /api/projects/:id/members - Add member to project
router.post('/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id is required'
      });
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Add member to project (ignore if already exists)
    const { error: memberError } = await supabase
      .from('project_members')
      .insert([
        {
          project_id: id,
          user_id: user_id
        }
      ]);

    // Ignore duplicate key error (member already exists)
    if (memberError && !memberError.message.includes('duplicate')) {
      console.error('Supabase error:', memberError);
      return res.status(400).json({
        success: false,
        error: memberError.message
      });
    }

    // Return updated project with members
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Get updated members list
    const { data: members } = await supabase
      .from('project_members')
      .select(`
        users (
          id,
          name,
          avatar
        )
      `)
      .eq('project_id', id);

    const projectWithMembers = {
      ...project,
      members: members?.map(m => m.users) || []
    };

    res.json({
      success: true,
      data: projectWithMembers
    });
  } catch (err) {
    console.error('Error adding member to project:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to add member to project'
    });
  }
});

// DELETE /api/projects/:id/members/:user_id - Remove member from project
router.delete('/:id/members/:user_id', async (req, res) => {
  try {
    const { id, user_id } = req.params;

    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', id)
      .eq('user_id', user_id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Member removed from project successfully'
    });
  } catch (err) {
    console.error('Error removing member from project:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to remove member from project'
    });
  }
});

module.exports = router;