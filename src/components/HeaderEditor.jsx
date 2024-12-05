import { headerConfig } from '../config/header';

export default function HeaderEditor() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Configuración del Encabezado</h2>
            
            <form id="headerForm" className="space-y-4">
                {/* Título */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Título
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={headerConfig.title}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Subtítulo */}
                <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
                        Subtítulo
                    </label>
                    <input
                        type="text"
                        id="subtitle"
                        name="subtitle"
                        defaultValue={headerConfig.subtitle}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={headerConfig.email}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Imagen de Perfil */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Imagen de Perfil
                    </label>
                    <div className="mt-1 flex items-center space-x-4">
                        <img
                            src={headerConfig.profileImage}
                            alt="Profile Preview"
                            id="headerImagePreview"
                            className="h-12 w-12 rounded-full object-cover"
                        />
                        <input
                            type="file"
                            id="headerImageInput"
                            accept="image/*"
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
                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                            Instagram URL
                        </label>
                        <input
                            type="url"
                            id="instagram"
                            name="instagram"
                            defaultValue={headerConfig.socialLinks.instagram}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Facebook */}
                    <div>
                        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                            Facebook URL
                        </label>
                        <input
                            type="url"
                            id="facebook"
                            name="facebook"
                            defaultValue={headerConfig.socialLinks.facebook}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* TikTok */}
                    <div>
                        <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700">
                            TikTok URL
                        </label>
                        <input
                            type="url"
                            id="tiktok"
                            name="tiktok"
                            defaultValue={headerConfig.socialLinks.tiktok}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* YouTube */}
                    <div>
                        <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                            YouTube URL
                        </label>
                        <input
                            type="url"
                            id="youtube"
                            name="youtube"
                            defaultValue={headerConfig.socialLinks.youtube}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
