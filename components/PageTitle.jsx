export function PageTitle(props) {
  return (
    <h1 
      className="text-2xl font-bold mx-2 mt-3"
    >
      {props.title}
    </h1>
  );
}