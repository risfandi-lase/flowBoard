import React, { useState } from "react";

interface AddMemberModalProps {
  isModalOpen: boolean;
  onClose: () => void;
}

function AddMemberModal({ isModalOpen, onClose }: AddMemberModalProps) {
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");

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

  const handleSubmit = () => {
    // Here you can use the name and imageBase64
    console.log("Name:", name);
    console.log("Image Base64:", imageBase64);
    
    // Reset form
    setName("");
    setImagePreview("");
    setImageBase64("");
    onClose();
  };

  const handleCancel = () => {
    // Reset form when canceling
    setName("");
    setImagePreview("");
    setImageBase64("");
    onClose();
  };

  return (
    <div>
      <dialog id="my_modal_1" open={isModalOpen} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Member</h3>
          <div className="border-t-1 mt-3"></div>
          
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-lg">Name</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="Type here"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                />
                <p className="text-gray-400 mt-4">
                  An image of the person, it's best if it has the same length
                  and height
                </p>
              </div>
            </div>
          </fieldset>
          
          <div className="modal-action">
            <div className="flex gap-2">
              <button 
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!name.trim()}
              >
                ADD
              </button>
              <button onClick={handleCancel} className="btn">
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