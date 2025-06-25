import { categorias, posts, deleteCategoria, crearCategoria } from "./app/data";

console.log("=== PRUEBA DE FUNCIONES ===");
console.log("Categorías iniciales:", categorias);
console.log("Posts iniciales:", posts.length);

// Probar crear categoría
try {
  const nuevaCategoria = crearCategoria("Prueba");
  console.log("✅ Crear categoría funcionó:", nuevaCategoria);
} catch (error) {
  console.log("❌ Error al crear categoría:", error);
}

// Probar eliminar categoría
try {
  const resultado = deleteCategoria(1);
  console.log("✅ Eliminar categoría funcionó:", resultado);
  console.log("Categorías después:", categorias);
  console.log("Posts después:", posts.length);
} catch (error) {
  console.log("❌ Error al eliminar categoría:", error);
}
