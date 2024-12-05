import { useState, useEffect } from 'react';

export default function HeaderEditor() {
    const [config, setConfig] = useState({
        title: "Mi Tienda Online",
        subtitle: "Productos + Ofertas",
        email: "contacto@ejemplo.com",
        profileImage: "/default-profile.jpg",
        socialLinks: {}
    });

    useEffect(() => {
        const savedConfig = localStorage.getItem('headerConfig');
        if (savedConfig) {
            setConfig(JSON.parse(savedConfig));
        }
    }, []);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setConfig(prev => ({
                        ...prev,
                        profileImage: reader.result
                    }));
                    document.getElementById('headerImagePreview').src = reader.result;
                    document.getElementById('removeImageBtn').classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error al procesar la imagen:', error);
                alert('Error al procesar la imagen. Por favor, intenta con otra imagen.');
            }
        }
    };

    const handleRemoveImage = () => {
        setConfig(prev => ({
            ...prev,
            profileImage: "/default-profile.jpg"
        }));
        document.getElementById('headerImageInput').value = '';
        document.getElementById('removeImageBtn').classList.add('hidden');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            localStorage.setItem('headerConfig', JSON.stringify(config));
            window.dispatchEvent(new Event('headerConfigUpdated'));
            alert('Configuración guardada correctamente');
        } catch (error) {
            console.error('Error al guardar la configuración:', error);
            alert('Error al guardar la configuración. Por favor intenta de nuevo.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Configuración del Header</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Título</label>
                        <input 
                            type="text" 
                            value={config.title}
                            onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Mi Tienda Online"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Subtítulo</label>
                        <input 
                            type="text" 
                            value={config.subtitle}
                            onChange={(e) => setConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Productos + Ofertas"
                        />
                    </div>
                </div>

                {/* Email y Foto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            value={config.email}
                            onChange={(e) => setConfig(prev => ({ ...prev, email: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="contacto@ejemplo.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Imagen de Perfil</label>
                        <div className="mt-1 flex items-center gap-4">
                            <img 
                                id="headerImagePreview"
                                src={config.profileImage}
                                alt="Vista previa" 
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div className="flex flex-col gap-2">
                                <input 
                                    type="file" 
                                    id="headerImageInput"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <button 
                                    type="button" 
                                    id="removeImageBtn"
                                    onClick={handleRemoveImage}
                                    className="text-sm text-red-600 hover:text-red-700 hidden"
                                >
                                    Eliminar imagen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Redes Sociales */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Redes Sociales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                <i className="fab fa-instagram mr-2"></i>Instagram URL
                            </label>
                            <input 
                                type="url" 
                                value={config.socialLinks?.instagram || ''}
                                onChange={(e) => setConfig(prev => ({
                                    ...prev,
                                    socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="https://instagram.com/tutienda"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                <i className="fab fa-tiktok mr-2"></i>TikTok URL
                            </label>
                            <input 
                                type="url" 
                                value={config.socialLinks?.tiktok || ''}
                                onChange={(e) => setConfig(prev => ({
                                    ...prev,
                                    socialLinks: { ...prev.socialLinks, tiktok: e.target.value }
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="https://tiktok.com/@tutienda"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                <i className="fab fa-facebook mr-2"></i>Facebook URL
                            </label>
                            <input 
                                type="url" 
                                value={config.socialLinks?.facebook || ''}
                                onChange={(e) => setConfig(prev => ({
                                    ...prev,
                                    socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="https://facebook.com/tutienda"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                <i className="fab fa-youtube mr-2"></i>YouTube URL
                            </label>
                            <input 
                                type="url" 
                                value={config.socialLinks?.youtube || ''}
                                onChange={(e) => setConfig(prev => ({
                                    ...prev,
                                    socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="https://youtube.com/@tutienda"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <i className="fas fa-save"></i>
                        Guardar Configuración
                    </button>
                </div>
            </form>
        </div>
    );
}
