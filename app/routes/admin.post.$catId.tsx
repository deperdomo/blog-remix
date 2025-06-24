import { LoaderFunctionArgs, json, ActionFunctionArgs, redirect } from "@remix-run/node";
import { getPosts, Post, deletePost, crearPost, categorias } from "../data";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import PostElement from "../components/PostComponent";
import { useState } from "react";


export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const categoriaId = parseInt(params.catId || "0", 10);
  const posts = await getPosts(categoriaId);
  const categoria = categorias.find(cat => cat.id === categoriaId);

  if (!posts || !categoria) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ posts, categoria });
};



export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const categoriaId = parseInt(params.catId || "0", 10);

  if (intent === "delete") {
    const postId = formData.get("postId");
    if (typeof postId === "string") {
      const id = parseInt(postId, 10);
      const deleted = deletePost(id);

      if (deleted) {
        return redirect(`/admin/post/${categoriaId}`);
      } else {
        return json({ error: "Post no encontrado" }, { status: 404 });
      }
    }
  }

  if (intent === "create") {
    const titulo = formData.get("titulo");
    const contenido = formData.get("contenido");

    if (typeof titulo === "string" && typeof contenido === "string") {
      try {
        const nuevoPost = crearPost(titulo, contenido, categoriaId);
        return redirect(`/admin/post/${categoriaId}`);
      } catch (error) {
        return json({ error: "Error al crear el post" }, { status: 500 });
      }
    }
  }

  return json({ error: "Acción no válida" }, { status: 400 });
};


export default function PostList() {
  const { posts, categoria } = useLoaderData<{ posts: Post[], categoria: { id: number, nombre: string } }>();
  const navigate = useNavigate();
  const submit = useSubmit();
  const [showModal, setShowModal] = useState(false);

  const handleEditarPost = (id: number) => {
    console.log(`Editar post con ID: ${id}`);
    navigate(`/admin/post/edit/${id}`);
  }

  const handleEliminarPost = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este post?")) {
      const formData = new FormData();
      formData.append("intent", "delete");
      formData.append("postId", id.toString());
      submit(formData, { method: "post" });
    }
  }

  const handleCrearPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("intent", "create");
    submit(formData, { method: "post" });
    setShowModal(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header con título y botón de crear */}
      <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="pr-6">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Posts de {categoria.nombre}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} en esta categoría
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Nuevo Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de posts */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: Post) => (
              <PostElement
                key={post.id}
                id={post.id}
                titulo={post.titulo}
                contenido={post.contenido}
                fechaCreacion={post.fechaCreacion}
                categoria={post.categoria}
                handleEditarPost={handleEditarPost}
                handleEliminarPost={handleEliminarPost}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6">
              <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No hay posts en esta categoría
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Crea tu primer post para comenzar a compartir contenido con tu audiencia.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Primer Post
            </button>
          </div>
        )}
      </div>

      {/* Modal para crear post */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Crear Nuevo Post
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCrearPost} className="p-6">
              <div className="mb-6">
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título del Post
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ingresa el título de tu post..."
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contenido
                </label>
                <textarea
                  id="contenido"
                  name="contenido"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  placeholder="Escribe el contenido de tu post..."
                />
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Crear Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


