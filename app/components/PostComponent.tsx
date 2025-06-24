import { Post } from "../data";

interface PostElementProps extends Post {
  handleEditarPost: (id: number) => void;
  handleEliminarPost: (id: number) => void;
}

export default function PostElement({ id, titulo, contenido, handleEditarPost, handleEliminarPost }: PostElementProps) {
  return (
    <article
      className="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          className="p-2 rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-110"
          onClick={() => handleEditarPost(id)}
          title="Editar post"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          className="p-2 rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:scale-110"
          onClick={() => handleEliminarPost(id)}
          title="Eliminar post"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Post content */}
      <div className="pr-16">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
          {titulo}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
          {contenido}
        </p>
      </div>

      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </article>
  )
}
