import { Post } from "../data";

interface PostElementProps extends Post {
  handleEditarPost: (id: number) => void;
  handleEliminarPost: (id: number) => void;
}

export default function PostElement({ id, titulo, contenido, handleEditarPost, handleEliminarPost }: PostElementProps) {
  return (
    <div
      className="relative p-4 border rounded-lg shadow-md bg-white dark:bg-gray-700 dark:border-gray-700"
    >
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mr-3">
        {titulo}
      </h2>
      <div className="absolute top-2 right-2 flex space-x-1">
        <button
          className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={() => handleEditarPost(id)}
          title="Editar post"
        >
          ✏️
        </button>
        <button
          className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          onClick={() => handleEliminarPost(id)}
          title="Eliminar post"
        >
          🗑️
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {contenido}
      </p>
    </div>
  )
}
