import { Button } from 'components/Button'



export function BottomMenu(props) {
  const { appStateStore, tableStore } = props;

  return (
    <menu
      className="flex py-2 justify-center"
    >
     {props.children} 
    </menu>
  )
}