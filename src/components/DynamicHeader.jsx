import { useState, useEffect } from 'react';

export default function DynamicHeader() {
    const [config, setConfig] = useState({
        title: "Mi Tienda Online",
        subtitle: "Productos + Ofertas",
        email: "contacto@ejemplo.com",
        profileImage: "/default-profile.jpg",
        socialLinks: {}
    });

    useEffect(() => {
        // Cargar configuración inicial
        const savedConfig = localStorage.getItem('headerConfig');
        if (savedConfig) {
            setConfig(JSON.parse(savedConfig));
        }

        // Escuchar cambios en la configuración
        const handleConfigUpdate = () => {
            const updatedConfig = localStorage.getItem('headerConfig');
            if (updatedConfig) {
                setConfig(JSON.parse(updatedConfig));
            }
        };

        window.addEventListener('headerConfigUpdated', handleConfigUpdate);
        window.addEventListener('storage', (e) => {
            if (e.key === 'headerConfig') {
                handleConfigUpdate();
            }
        });

        return () => {
            window.removeEventListener('headerConfigUpdated', handleConfigUpdate);
            window.removeEventListener('storage', handleConfigUpdate);
        };
    }, []);

    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6">
            <div className="container mx-auto px-8 md:px-2">
                <div className="relative w-full md:w-72 mx-auto">
                    <div className="absolute w-full flex justify-center -top-14 md:hidden">
                        <div className="w-24 h-24">
                            <img 
                                src={config.profileImage || "/default-profile.jpg"}
                                alt={config.title}
                                className="w-full h-full rounded-full object-cover shadow-lg"
                            />
                        </div>
                    </div>
                    <div className="bg-gray-200 bg-opacity-40 backdrop-blur-md p-2 shadow-xl md:mt-0 mt-12">
                        {/* Perfil */}
                        <div className="text-center">
                            <div className="relative w-24 h-24 mx-auto mb-4 hidden md:block">
                                <img 
                                    src={config.profileImage || "/default-profile.jpg"}
                                    alt={config.title}
                                    className="w-full h-full rounded-full object-cover shadow-lg"
                                />
                            </div>
                            <h1 className="text-3xl font-bold mb-2 md:mt-0 mt-8">{config.title}</h1>
                            <p className="text-[10px] md:text-xs text-gray-100 mb-4">{config.subtitle}</p>
                            <a href={`mailto:${config.email}`} className="text-blue-300 hover:text-blue-200 transition-colors">
                                <i className="far fa-envelope mr-2"></i>{config.email}
                            </a>
                        </div>

                        {/* Redes Sociales */}
                        {Object.entries(config.socialLinks || {}).length > 0 && (
                            <div className="flex justify-center gap-6 mt-6">
                                {config.socialLinks?.instagram && (
                                    <a 
                                        href={config.socialLinks.instagram}
                                        className="text-2xl text-gray-100 hover:text-white hover:scale-110 transform transition-all"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Visitar Instagram"
                                    >
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                )}
                                {config.socialLinks?.tiktok && (
                                    <a 
                                        href={config.socialLinks.tiktok}
                                        className="text-2xl text-gray-100 hover:text-white hover:scale-110 transform transition-all"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Visitar TikTok"
                                    >
                                        <i className="fab fa-tiktok"></i>
                                    </a>
                                )}
                                {config.socialLinks?.facebook && (
                                    <a 
                                        href={config.socialLinks.facebook}
                                        className="text-2xl text-gray-100 hover:text-white hover:scale-110 transform transition-all"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Visitar Facebook"
                                    >
                                        <i className="fab fa-facebook"></i>
                                    </a>
                                )}
                                {config.socialLinks?.youtube && (
                                    <a 
                                        href={config.socialLinks.youtube}
                                        className="text-2xl text-gray-100 hover:text-white hover:scale-110 transform transition-all"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Visitar YouTube"
                                    >
                                        <i className="fab fa-youtube"></i>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
