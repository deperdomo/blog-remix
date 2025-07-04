import { LoaderFunctionArgs, json, redirect, ActionFunctionArgs } from "@remix-run/node";
import { editarPost, getPost, Post } from "../data";
import { Form, useActionData, useLoaderData, Link } from "@remix-run/react";


export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const postId = parseInt(params.postId || "0", 10);
  
  if (isNaN(postId) || postId <= 0) {
    throw new Response("ID de post inválido", { status: 400 });
  }

  const post = getPost(postId);

  if (!post) {
    throw new Response("Post no encontrado", { status: 404 });
  }
  return json({ post });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const postId = parseInt(params.postId || "0", 10);

  if (isNaN(postId) || postId <= 0) {
    return json({ error: "ID de post inválido" }, { status: 400 });
  }

  const titulo = formData.get("titulo");
  const contenido = formData.get("contenido");

  if (typeof titulo !== "string" || typeof contenido !== "string") {
    return json({ error: "Datos de post inválidos" }, { status: 400 });
  }

  if (titulo.trim() === "") {
    return json({ error: "El título no puede estar vacío" }, { status: 400 });
  }

  if (contenido.trim() === "") {
    return json({ error: "El contenido no puede estar vacío" }, { status: 400 });
  }

  const post = getPost(postId);
  if (!post) {
    return json({ error: "Post no encontrado" }, { status: 404 });
  }

  try {
    const updatedPost: Post = {
      ...post,
      titulo: titulo.trim(),
      contenido: contenido.trim(),
    };

    const success = editarPost(updatedPost);
    if (success) {
      return redirect(`/admin/post/${post.categoria.id}`);
    } else {
      return json({ error: "Error al actualizar el post" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error al actualizar el post:", error);
    return json({ error: error instanceof Error ? error.message : "Error al actualizar el post" }, { status: 500 });
  }
};


export default function EditPost() {
  const { post } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/admin/post/${post.categoria.id}`}
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la lista
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Editar Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Categoría: {post.categoria.nombre}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <Form method="post" className="p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título del Post
                </label>
                <input
                  type="text"
                  name="titulo"
                  id="titulo"
                  defaultValue={post.titulo}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contenido
                </label>
                <textarea
                  name="contenido"
                  id="contenido"
                  rows={8}
                  defaultValue={post.contenido}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  required
                />
              </div>

              {actionData?.error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-sm">{actionData.error}</p>
                </div>
              )}

              <div className="flex items-center justify-end space-x-4 pt-4">
                <Link
                  to={`/admin/post/${post.categoria.id}`}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}