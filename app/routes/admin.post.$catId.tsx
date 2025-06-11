import { LoaderFunctionArgs, json, ActionFunctionArgs, redirect } from "@remix-run/node";
import { getPosts, Post, deletePost } from "../data";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import PostElement from "../components/PostComponent";


export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const categoriaId = parseInt(params.catId || "0", 10);
  const posts = await getPosts(categoriaId);

  if (!posts) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ posts });
};



export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const postId = formData.get("postId");
  const categoriaId = parseInt(params.catId || "0", 10);

  if (intent === "delete" && typeof postId === "string") {
    const id = parseInt(postId, 10);
    const deleted = deletePost(id);

    if (deleted) {
      return redirect(`/admin/post/${categoriaId}`);
    } else {
      return json({ error: "Post no encontrado" }, { status: 404 });
    }
  }

  return json({ error: "Acción no válida" }, { status: 400 });
};


export default function PostList() {
  const { posts } = useLoaderData<{ posts: Post[] }>();
  const navigate = useNavigate();
  const submit = useSubmit();

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

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
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



    </>


  );
}


