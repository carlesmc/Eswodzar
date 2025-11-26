import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Camera, Loader2 } from 'lucide-react';

const ProfilePhotoUpload = ({ url, onUpload }) => {
    const [uploading, setUploading] = useState(false);

    const uploadAvatar = async (event) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('profile-photos')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('profile-photos')
                .getPublicUrl(filePath);

            onUpload(data.publicUrl);
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-gray-800 overflow-hidden bg-gray-700 flex items-center justify-center mx-auto">
                {url ? (
                    <img
                        src={url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Camera className="w-12 h-12 text-gray-500" />
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
                    </div>
                )}
            </div>

            <label className="absolute bottom-0 right-1/2 translate-x-12 translate-y-2 bg-brand-orange text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-lg">
                <Camera className="w-4 h-4" />
                <input
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="hidden"
                />
            </label>
        </div>
    );
};

export default ProfilePhotoUpload;
