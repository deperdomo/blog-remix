import { Form, Link, Outlet, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { json, redirect, ActionFunctionArgs } from "@remix-run/node";

import { categorias, crearCategoria, deleteCategoria } from "../data";

// Loader para cargar los datos en el servidor
export const loader = async () => {
  return json({ categorias });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  // Lógica para eliminar categoría
  if (intent === "delete") {
    const categoriaId = formData.get("categoriaId");
    if (typeof categoriaId !== "string") {
      return json({ error: "ID de categoría inválido" }, { status: 400 });
    }

    deleteCategoria(parseInt(categoriaId, 10));
    return redirect("/admin");
  }

  // Lógica para crear categoría
  if (intent === "create") {
    const nombre = formData.get("nombre");
    if (typeof nombre !== "string" || nombre.trim() === "") {
      return json({ error: "El nombre de la categoría es requerido" }, { status: 400 });
    }

    crearCategoria(nombre.trim());
    return redirect("/admin");
  }

};

export default function Admin() {
  const actionData = useActionData<typeof action>();
  const { categorias: categoriasData } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleEliminarCategoria = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      const formData = new FormData();
      formData.append("intent", "delete");
      formData.append("categoriaId", id.toString());
      submit(formData, { method: "post" });
    }
  };

  return (
    
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-w-full bg-gray-900 text-white flex flex-col shadow-lg">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold tracking-tight">
            Admin Panel
          </h1>
        </div>

        {/* Formulario de creación */}
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <Form method="post" className="space-y-3">
            <input type="hidden" name="intent" value="create" />
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">
                Nueva Categoría
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  placeholder="Nombre de categoría"
                  className="flex-1 bg-gray-700 border border-gray-600 text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  +
                </button>
              </div>
              {actionData?.error && (
                <p className="text-red-400 text-xs mt-1">{actionData.error}</p>
              )}
            </div>
          </Form>
        </div>

        {/* Lista de categorías */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
            Categorías
          </h3>
          <ul className="space-y-1">
            {categoriasData && categoriasData.length > 0 ? (
              categoriasData.map(({ id, nombre }) => (
                <li key={id} className="group">
                  <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-800 group-hover:bg-gray-800 transition-colors">
                    <Link
                      to={`/admin/post/${id}`}
                      className="flex-1 text-gray-300 hover:text-white truncate"
                    >
                      {nombre}
                    </Link>
                    <button
                      onClick={() => handleEliminarCategoria(id)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                      aria-label={`Eliminar ${nombre}`}
                      type="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500 text-sm italic">
                No hay categorías disponibles.
              </li>
            )}
          </ul>
        </nav>

        {/* Footer del sidebar */}
        <div className="p-4 bg-gray-800 text-xs text-gray-500 border-t border-gray-700">
          Admin Dashboard v1.0
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 bg-gray-200">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}