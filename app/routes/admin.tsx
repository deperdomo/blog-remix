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

    const id = parseInt(categoriaId, 10);
    if (isNaN(id) || id <= 0) {
      return json({ error: "ID de categoría inválido" }, { status: 400 });
    }

    try {
      const deleted = deleteCategoria(id);
      if (deleted) {
        return redirect("/admin");
      } else {
        return json({ error: "Categoría no encontrada" }, { status: 404 });
      }
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      return json({ 
        error: error instanceof Error ? error.message : "Error al eliminar la categoría" 
      }, { status: 400 });
    }
  }

  // Lógica para crear categoría
  if (intent === "create") {
    const nombre = formData.get("nombre");
    if (typeof nombre !== "string" || nombre.trim() === "") {
      return json({ error: "El nombre de la categoría es requerido" }, { status: 400 });
    }

    if (nombre.trim().length > 50) {
      return json({ error: "El nombre de la categoría no puede tener más de 50 caracteres" }, { status: 400 });
    }

    // Verificar si ya existe una categoría con el mismo nombre
    const existeCategoria = categorias.some(cat => 
      cat.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (existeCategoria) {
      return json({ error: "Ya existe una categoría con ese nombre" }, { status: 400 });
    }

    try {
      crearCategoria(nombre.trim());
      return redirect("/admin");
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      return json({ error: "Error interno del servidor al crear la categoría" }, { status: 500 });
    }
  }

  return json({ error: "Acción no válida" }, { status: 400 });
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
    
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-full max-w-sm bg-gray-800 dark:bg-gray-900 text-white flex flex-col shadow-xl border-r border-gray-700 dark:border-gray-800">
        <div className="p-8 border-b border-gray-700 dark:border-gray-800">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Admin Panel
          </h1>
        </div>

        {/* Formulario de creación */}
        <div className="p-6 bg-gray-700 dark:bg-gray-800 border-b border-gray-600 dark:border-gray-700">
          <Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="create" />
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-200 dark:text-gray-300 mb-3">
                Nueva Categoría
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  placeholder="Nombre de categoría"
                  className="flex-1 bg-gray-600 dark:bg-gray-700 border border-gray-500 dark:border-gray-600 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              {actionData?.error && (
                <p className="text-red-400 text-xs mt-3">{actionData.error}</p>
              )}
            </div>
          </Form>
        </div>

        {/* Lista de categorías */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <h3 className="text-gray-300 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4 px-3">
            Categorías
          </h3>
          <ul className="space-y-2">
            {categoriasData && categoriasData.length > 0 ? (
              categoriasData.map(({ id, nombre }) => (
                <li key={id} className="group">
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200">
                    <Link
                      to={`/admin/post/${id}`}
                      className="flex-1 text-gray-200 dark:text-gray-300 hover:text-white font-medium truncate"
                    >
                      {nombre}
                    </Link>
                    <Form method="post" className="inline">
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="categoriaId" value={id} />
                      <button
                        type="submit"
                        className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 ml-2"
                        aria-label={`Eliminar ${nombre}`}
                        onClick={(e) => {
                          if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </Form>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-gray-400 dark:text-gray-500 text-sm italic">
                No hay categorías disponibles.
              </li>
            )}
          </ul>
        </nav>

        {/* Footer del sidebar */}
        <div className="p-6 bg-gray-700 dark:bg-gray-800 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-600 dark:border-gray-700">
          Admin Dashboard v1.0
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}