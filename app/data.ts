export interface Categoria {
  id: number;
  nombre: string;
}

export interface Post {
  id: number;
  titulo: string;
  contenido: string;
  fechaCreacion: string;
  categoria: Categoria;
}

export let categorias: Categoria[] = [
  { id: 1, nombre: "Tecnología" },
  { id: 2, nombre: "Salud" },
  { id: 3, nombre: "Estilo de Vida" },
];

let nextCategoriaId = categorias.length + 1;

export function crearCategoria(nombre: string): Categoria {
  if (!nombre || nombre.trim() === "") {
    throw new Error("El nombre de la categoría es requerido");
  }

  if (nombre.trim().length > 50) {
    throw new Error("El nombre de la categoría no puede tener más de 50 caracteres");
  }

  const nuevaCategoria: Categoria = {
    id: nextCategoriaId++,
    nombre: nombre.trim(),
  };

  categorias.push(nuevaCategoria);
  return nuevaCategoria;
}
export function getPosts(categoriaId: number) {
  return posts.filter((post) => post.categoria.id === categoriaId);
}

export function getPost(postId: number) {
  return posts.find((post) => post.id === postId);
}

export function deleteCategoria(categoriaId: number): boolean {
  if (isNaN(categoriaId) || categoriaId <= 0) {
    throw new Error("ID de categoría inválido");
  }

  const index = categorias.findIndex((categoria) => categoria.id === categoriaId);
  if (index !== -1) {
    // Eliminar todos los posts de esta categoría de forma más eficiente
    for (let i = posts.length - 1; i >= 0; i--) {
      if (posts[i].categoria.id === categoriaId) {
        posts.splice(i, 1);
      }
    }
    
    categorias.splice(index, 1);
    return true;
  }
  return false;
}

export function editarPost(newPost: Post): boolean {
  if (!newPost || !newPost.id) {
    throw new Error("Post inválido");
  }

  if (!newPost.titulo || newPost.titulo.trim() === "") {
    throw new Error("El título del post es requerido");
  }

  if (!newPost.contenido || newPost.contenido.trim() === "") {
    throw new Error("El contenido del post es requerido");
  }

  const post = posts.find((post) => post.id === newPost.id);
  if (post) {
    post.titulo = newPost.titulo.trim();
    post.contenido = newPost.contenido.trim();
    return true;
  }
  return false;
}

export function deletePost(postId: number) {
  const index = posts.findIndex((post) => post.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
    return true;
  }
  return false;
}

let nextPostId = 10; // Inicializamos con 10 porque ya hay 9 posts

export function crearPost(titulo: string, contenido: string, categoriaId: number): Post {
  if (!titulo || titulo.trim() === "") {
    throw new Error("El título del post es requerido");
  }

  if (!contenido || contenido.trim() === "") {
    throw new Error("El contenido del post es requerido");
  }

  if (titulo.trim().length > 200) {
    throw new Error("El título no puede tener más de 200 caracteres");
  }

  if (contenido.trim().length > 5000) {
    throw new Error("El contenido no puede tener más de 5000 caracteres");
  }

  if (isNaN(categoriaId) || categoriaId <= 0) {
    throw new Error("ID de categoría inválido");
  }

  const categoria = categorias.find(cat => cat.id === categoriaId);
  if (!categoria) {
    throw new Error(`Categoría con ID ${categoriaId} no encontrada`);
  }

  const nuevoPost: Post = {
    id: nextPostId++,
    titulo: titulo.trim(),
    contenido: contenido.trim(),
    fechaCreacion: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    categoria,
  };

  posts.push(nuevoPost);
  return nuevoPost;
}

export let posts: Post[] = [
  {
    id: 1,
    titulo: "Introducción a TypeScript",
    contenido: "TypeScript es un superconjunto de JavaScript que agrega tipos estáticos.",
    fechaCreacion: "2023-10-01",
    categoria: { id: 1, nombre: "Tecnología" },
  },
  {
    id: 2,
    titulo: "Beneficios de la meditación",
    contenido: "La meditación puede reducir el estrés y mejorar la concentración.",
    fechaCreacion: "2023-10-02",
    categoria: { id: 2, nombre: "Salud" },
  },
  {
    id: 3,
    titulo: "Cómo llevar un estilo de vida saludable",
    contenido: "Una dieta equilibrada y ejercicio regular son clave para una vida saludable.",
    fechaCreacion: "2023-10-03",
    categoria: { id: 3, nombre: "Estilo de Vida" },
  },
  {
    id: 4,
    titulo: "Novedades en React 18",
    contenido: "React 18 introduce nuevas características como el modo concurrente.",
    fechaCreacion: "2023-10-04",
    categoria: { id: 1, nombre: "Tecnología" },
  },
  {
    id: 5,
    titulo: "Importancia de la salud mental",
    contenido: "La salud mental es tan importante como la salud física.",
    fechaCreacion: "2023-10-05",
    categoria: { id: 2, nombre: "Salud" },
  },
  {
    id: 6,
    titulo: "Consejos para una vida equilibrada",
    contenido: "Encuentra un equilibrio entre trabajo, familia y tiempo personal.",
    fechaCreacion: "2023-10-06",
    categoria: { id: 3, nombre: "Estilo de Vida" },
  },
  {
    id: 7,
    titulo: "Introducción a la inteligencia artificial",
    contenido: "La inteligencia artificial está transformando diversas industrias.",
    fechaCreacion: "2023-10-07",
    categoria: { id: 1, nombre: "Tecnología" },
  },
  {
    id: 8,
    titulo: "Estrategias para manejar el estrés",
    contenido: "Técnicas de respiración y mindfulness pueden ayudar a reducir el estrés.",
    fechaCreacion: "2023-10-08",
    categoria: { id: 2, nombre: "Salud" },
  },
  {
    id: 9,
    titulo: "Cómo crear hábitos saludables",
    contenido: "Establecer metas realistas es clave para formar nuevos hábitos.",
    fechaCreacion: "2023-10-09",
    categoria: { id: 3, nombre: "Estilo de Vida" },
  }
];

