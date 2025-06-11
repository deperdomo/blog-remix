import { LoaderFunctionArgs, json, redirect, ActionFunctionArgs } from "@remix-run/node";
import { editarPost, getPost, Post } from "../data";
import { Form, useActionData, useLoaderData, useNavigate } from "@remix-run/react";


export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const postId = parseInt(params.postId || "0", 10);
  const post = getPost(postId);

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const postId = parseInt(params.postId || "0", 10);

  const titulo = formData.get("titulo");
  const contenido = formData.get("contenido");

  if (typeof titulo !== "string" || typeof contenido !== "string") {
    return json({ error: "Datos de post inválidos" }, { status: 400 });
  }

  const post = getPost(postId);
  if (!post) {
    return json({ error: "Post no encontrado" }, { status: 404 });
  }

  const updatedPost: Post = {
    ...post,
    titulo,
    contenido,
  };

  editarPost(updatedPost);
  return redirect(`/admin/post/${post.categoria.id}`);
};


export default function EditPost() {
  const { post } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg">
      <h1 className="text-2xl font-bold text-white mb-6">Editar Post</h1>

      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-300 mb-2">
            Título
          </label>
          <input
            type="text"
            name="titulo"
            id="titulo"
            defaultValue={post.titulo}
            className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-3"
            required
          />
        </div>

        <div>
          <label htmlFor="contenido" className="block text-sm font-medium text-gray-300 mb-2">
            Contenido
          </label>
          <textarea
            name="contenido"
            id="contenido"
            rows={6}
            defaultValue={post.contenido}
            className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-3"
            required
          />
        </div>

        {actionData?.error && (
          <p className="text-red-400 text-sm">{actionData.error}</p>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      </Form>
    </div>
  );
}