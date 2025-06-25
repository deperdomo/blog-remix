import { LoaderFunctionArgs, json, ActionFunctionArgs, redirect } from "@remix-run/node";
import { getPosts, Post, deletePost, categorias } from "../data";
import { useLoaderData, useNavigate, useSubmit, Link } from "@remix-run/react";
import PostElement from "../components/PostComponent";


export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const categoriaId = parseInt(params.catId || "0", 10);
  
  if (isNaN(categoriaId) || categoriaId <= 0) {
    throw new Response("ID de categoría inválido", { status: 400 });
  }

  const posts = getPosts(categoriaId);
  const categoria = categorias.find(cat => cat.id === categoriaId);

  if (!categoria) {
    throw new Response("Categoría no encontrada", { status: 404 });
  }
  
  return json({ posts, categoria });
};



export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const categoriaId = parseInt(params.catId || "0", 10);

  if (isNaN(categoriaId) || categoriaId <= 0) {
    return json({ error: "ID de categoría inválido" }, { status: 400 });
  }

  if (intent === "delete") {
    const postId = formData.get("postId");
    if (typeof postId === "string") {
      const id = parseInt(postId, 10);
      if (isNaN(id) || id <= 0) {
        return json({ error: "ID de post inválido" }, { status: 400 });
      }

      try {
        const deleted = deletePost(id);
        if (deleted) {
          return redirect(`/admin/post/${categoriaId}`);
        } else {
          return json({ error: "Post no encontrado" }, { status: 404 });
        }
      } catch (error) {
        console.error("Error al eliminar el post:", error);
        return json({ error: "Error interno del servidor al eliminar el post" }, { status: 500 });
      }
    }
    return json({ error: "ID de post requerido" }, { status: 400 });
  }

  return json({ error: "Acción no válida" }, { status: 400 });
};


export default function PostList() {
  const { posts, categoria } = useLoaderData<{ posts: Post[], categoria: { id: number, nombre: string } }>();
  const navigate = useNavigate();
  const submit = useSubmit();

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
              <Link
                to={`/admin/post/new/${categoria.id}`}
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Nuevo Post
              </Link>
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
            <Link
              to={`/admin/post/new/${categoria.id}`}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Primer Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}


