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

export const categorias = [
  { id: 1, nombre: "Tecnología" },
  { id: 2, nombre: "Salud" },
  { id: 3, nombre: "Estilo de Vida" },
];

let nextCategoriaId = categorias.length + 1;

export function crearCategoria(nombre: string): Categoria {
  const nuevaCategoria: Categoria = {
    id: nextCategoriaId++,
    nombre,
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

export function getPostsByCategoria(categoriaId: number) {
  return posts.find((post) => post.id === categoriaId);
}

export function deleteCategoria(categoriaId: number) {
  const index = categorias.findIndex((categoria) => categoria.id === categoriaId);
  if (index !== -1) {
    categorias.splice(index, 1);
  }
}

export function editarPost(newPost: Post) {
  const post = posts.find((post) => post.id === newPost.id);
  if (post) {
    post.titulo = newPost.titulo;
    post.contenido = newPost.contenido;
  }
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
  const categoria = categorias.find(cat => cat.id === categoriaId);
  if (!categoria) {
    throw new Error(`Categoría con ID ${categoriaId} no encontrada`);
  }

  const nuevoPost: Post = {
    id: nextPostId++,
    titulo,
    contenido,
    fechaCreacion: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    categoria,
  };

  posts.push(nuevoPost);
  return nuevoPost;
}

export const posts: Post[] = [
  {
    id: 1,
    titulo: "Introducción a TypeScript",
    contenido: "TypeScript es un superconjunto de JavaScript que agrega tipos estáticos.",
    fechaCreacion: "2023-10-01",
    categoria: categorias[0],
  },
  {
    id: 2,
    titulo: "Beneficios de la meditación",
    contenido: "La meditación puede reducir el estrés y mejorar la concentración.",
    fechaCreacion: "2023-10-02",
    categoria: categorias[1],
  },
  {
    id: 3,
    titulo: "Cómo llevar un estilo de vida saludable",
    contenido: "Una dieta equilibrada y ejercicio regular son clave para una vida saludable.",
    fechaCreacion: "2023-10-03",
    categoria: categorias[2],
  },
  {
    id: 4,
    titulo: "Novedades en React 18",
    contenido: "React 18 introduce nuevas características como el modo concurrente.",
    fechaCreacion: "2023-10-04",
    categoria: categorias[0],
  },
  {
    id: 5,
    titulo: "Importancia de la salud mental",
    contenido: "La salud mental es tan importante como la salud física.",
    fechaCreacion: "2023-10-05",
    categoria: categorias[1],
  },
  {
    id: 6,
    titulo: "Consejos para una vida equilibrada",
    contenido: "Encuentra un equilibrio entre trabajo, familia y tiempo personal.",
    fechaCreacion: "2023-10-06",
    categoria: categorias[2],
  },
  {
    id: 7,
    titulo: "Introducción a la inteligencia artificial",
    contenido: "La inteligencia artificial está transformando diversas industrias.",
    fechaCreacion: "2023-10-07",
    categoria: categorias[0],
  },
  {
    id: 8,
    titulo: "Estrategias para manejar el estrés",
    contenido: "Técnicas de respiración y mindfulness pueden ayudar a reducir el estrés.",
    fechaCreacion: "2023-10-08",
    categoria: categorias[1],
  },
  {
    id: 9,
    titulo: "Cómo crear hábitos saludables",
    contenido: "Establecer metas realistas es clave para formar nuevos hábitos.",
    fechaCreacion: "2023-10-09",
    categoria: categorias[2],
  }
];

