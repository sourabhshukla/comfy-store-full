import React, { useState } from "react";
import defaultAvatar from "/defaultAvatar.png";

const AvatarInput = ({ label, name, type, size }) => {
  const [avatar, setAvatar] = useState(defaultAvatar);
  const handleChange = (e) => {
    console.log(e.target.files);
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        // setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text capitalize">{label}</span>
      </label>
      <div className="flex items-center space-x-6">
        <div className="shrink-0">
          <img
            className="h-16 w-16 object-cover rounded-full"
            src={avatar}
            alt="Current profile photo"
          />
        </div>
        <label className="block">
          <span className="sr-only">Choose profile photo</span>
          <input
            type="file"
            name="avatar"
            className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
      hover:file:cursor-pointer
    "
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  );
};

export default AvatarInput;
