declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  
  export function jsx(
    type: React.ElementType,
    props: any,
    key?: string | number | null
  ): JSX.Element;
  
  export function jsxs(
    type: React.ElementType,
    props: any,
    key?: string | number | null
  ): JSX.Element;
}
