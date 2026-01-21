declare module 'gray-matter' {
  function matter(str: string, options?: any): {
    data: { [key: string]: any };
    content: string;
    orig: string;
  };
  export = matter;
}
