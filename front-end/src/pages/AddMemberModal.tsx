import React, { useState } from "react";
import { useApi } from "../contexts/ApiContext";

interface AddMemberModalProps {
  isModalOpen: boolean;
  onClose: () => void;
}

function AddMemberModal({ isModalOpen, onClose }: AddMemberModalProps) {
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { users, currentProject, addMemberToProject, createUser } = useApi();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !currentProject) return;
    
    setIsSubmitting(true);
    
    try {
      // Create new user first
      const newUser = await createUser({
        name: name.trim(),
        avatar: imageBase64 || "/src/assets/default-avatar.jpg"
      });
      
      if (newUser) {
        // Add the new user to current project
        await addMemberToProject(currentProject.id, newUser.id);
      }
      
      // Reset form
      handleCancel();
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form when canceling
    setName("");
    setImagePreview("");
    setImageBase64("");
    onClose();
  };

  // Filter out users that are already members of the current project
  const availableUsers = users.filter(user => 
    !currentProject?.members.some(member => member.id === user.id)
  );

  return (
    <div>
      <dialog id="my_modal_1" open={isModalOpen} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Member to Project</h3>
          <div className="border-t-1 mt-3"></div>
          
          {/* Show existing users first */}
          {availableUsers.length > 0 && (
            <>
              <div className="mt-4">
                <h4 className="font-semibold mb-3">Select Existing Member</h4>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {availableUsers.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer border"
                      onClick={async () => {
                        if (currentProject) {
                          setIsSubmitting(true);
                          await addMemberToProject(currentProject.id, user.id);
                          setIsSubmitting(false);
                          onClose();
                        }
                      }}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <div className="hidden w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-bold">
                        {user.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <span className="text-sm truncate">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="divider">OR</div>
            </>
          )}
          
          {/* Add new member form */}
          <div>
            <h4 className="font-semibold mb-3">Add New Member</h4>
            
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-lg">Name</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Type here"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </fieldset>
            
            <fieldset className="fieldset col-span-4">
              <legend className="fieldset-legend text-sm">Image</legend>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-32">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="w-25 h-25 object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-25 h-25 bg-gray-100 border-2 border-dashed border-gray-300 rounded-3xl flex items-center justify-center">
                      <span className="text-gray-400 text-xs text-center">
                        Avatar
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    name="image"
                    className="file-input w-full"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/svg+xml"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                  />
                  <p className="text-gray-400 mt-4">
                    An image of the person, it's best if it has the same length
                    and height
                  </p>
                </div>
              </div>
            </fieldset>
          </div>
          
          <div className="modal-action">
            <div className="flex gap-2">
              <button 
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!name.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Adding...
                  </>
                ) : (
                  "ADD"
                )}
              </button>
              <button 
                onClick={handleCancel} 
                className="btn"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default AddMemberModal;