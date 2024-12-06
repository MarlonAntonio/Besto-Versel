import { useState, useEffect } from 'react';
import { headerConfig as defaultConfig } from '../config/header';

export default function HeaderEditor() {
    const [config, setConfig] = useState(defaultConfig);

    useEffect(() => {
        // Cargar configuración guardada al montar el componente
        const savedConfig = localStorage.getItem('headerConfig');
        if (savedConfig) {
            try {
                setConfig(JSON.parse(savedConfig));
            } catch (error) {
                console.error('Error loading saved config:', error);
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = {
            title: e.target.title.value,
            subtitle: e.target.subtitle.value,
            email: e.target.email.value,
            profileImage: document.getElementById('headerImagePreview').src,
            socialLinks: {
                instagram: e.target.instagram.value,
                facebook: e.target.facebook.value,
                tiktok: e.target.tiktok.value,
                youtube: e.target.youtube.value
            }
        };

        try {
            localStorage.setItem('headerConfig', JSON.stringify(formData));
            window.dispatchEvent(new Event('headerConfigUpdated'));
            alert('Configuración guardada correctamente');
        } catch (error) {
            console.error('Error saving config:', error);
            alert('Error al guardar la configuración');
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => {
                    document.getElementById('headerImagePreview').src = reader.result;
                    document.getElementById('removeImageBtn').classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error processing image:', error);
                alert('Error al procesar la imagen');
            }
        }
    };

    const handleRemoveImage = () => {
        document.getElementById('headerImagePreview').src = defaultConfig.profileImage;
        document.getElementById('headerImageInput').value = '';
        document.getElementById('removeImageBtn').classList.add('hidden');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Configuración del Encabezado</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Título */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                        Título
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={config.title}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Subtítulo */}
                <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-900">
                        Subtítulo
                    </label>
                    <input
                        type="text"
                        id="subtitle"
                        name="subtitle"
                        defaultValue={config.subtitle}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={config.email}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Imagen de Perfil */}
                <div>
                    <label className="block text-sm font-medium text-gray-900">
                        Imagen de Perfil
                    </label>
                    <div className="mt-1 flex items-center space-x-4">
                        <img
                            src={config.profileImage}
                            alt="Profile Preview"
                            id="headerImagePreview"
                            className="h-12 w-12 rounded-full object-cover"
                        />
                        <input
                            type="file"
                            id="headerImageInput"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => document.getElementById('headerImageInput').click()}
                            className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Cambiar Imagen
                        </button>
                        <button
                            type="button"
                            id="removeImageBtn"
                            onClick={handleRemoveImage}
                            className="hidden rounded-md border border-red-300 bg-white py-2 px-3 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>

                {/* Redes Sociales */}
                <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">Redes Sociales</h3>
                    
                    {/* Instagram */}
                    <div>
                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-900">
                            Instagram URL
                        </label>
                        <input
                            type="url"
                            id="instagram"
                            name="instagram"
                            defaultValue={config.socialLinks.instagram}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Facebook */}
                    <div>
                        <label htmlFor="facebook" className="block text-sm font-medium text-gray-900">
                            Facebook URL
                        </label>
                        <input
                            type="url"
                            id="facebook"
                            name="facebook"
                            defaultValue={config.socialLinks.facebook}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* TikTok */}
                    <div>
                        <label htmlFor="tiktok" className="block text-sm font-medium text-gray-900">
                            TikTok URL
                        </label>
                        <input
                            type="url"
                            id="tiktok"
                            name="tiktok"
                            defaultValue={config.socialLinks.tiktok}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* YouTube */}
                    <div>
                        <label htmlFor="youtube" className="block text-sm font-medium text-gray-900">
                            YouTube URL
                        </label>
                        <input
                            type="url"
                            id="youtube"
                            name="youtube"
                            defaultValue={config.socialLinks.youtube}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}
