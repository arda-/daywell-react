import { classNames } from "lib/helpers";

const Button = (props) => {
  const { shape, disabled, size, style, className } = props;

  let rounding = "";
  let textWeight = "font-semibold";
  let textSize = "";
  let textColor = "";
  let bgColor = "";
  let shadow = "shadow disabled:shadow-none";
  let spacing = "";
  let ring = "";
  let outline =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600";
  let hover = "";
  let cursor = "disabled:cursor-not-allowed";

  switch (style) {
    case "primary":
      bgColor =
        "bg-amber-600 hover:bg-amber-500 active:bg-amber-500/80 disabled:bg-amber-600/70";
      textColor = "text-white";
      break;
    case "secondary":
    default:
      bgColor =
        "bg-white hover:bg-neutral-100 active:bg-neutral-200 disabled:bg-neutral-200";
      textColor = "text-neutral-900";
      ring = "ring-1 ring-inset ring-neutral-300";
      break;
    case "soft":
      break;
  }

  switch (size) {
    case "xs":
      rounding = "rounded";
      textSize += " text-xs";
      spacing = "px-2 py-1";
      break;
    case "sm":
      rounding = "rounded";
      textSize += " text-sm";
      spacing = "px-2 py-1";
      break;
    default:
    case "md":
      rounding = "rounded-md";
      textSize += " text-sm";
      spacing = "px-2.5 py-1.5";
      break;
    case "lg":
      rounding = "rounded-md";
      spacing = "px-3 py-2";
      break;
    case "xl":
      rounding = "rounded-lg";
      spacing = "px-3.5 py-2.5";
      break;
  }

  switch (shape) {
    case "rounded":
    case "circular":
      rounding = "rounded-full";
      break;
  }

  function handleOnClick(event) {
    event.stopPropagation();
    props.onClick();
  }

  return (
    <>
      <button
        disabled={props.disabled}
        className={classNames(
          rounding,
          spacing,
          textWeight,
          textSize,
          textColor,
          bgColor,
          ring,
          shadow,
          hover,
          outline,
          cursor,
          className
        )}
        type="button"
        onClick={handleOnClick}
      >
        {props.children}
      </button>
    </>
  );
};

export const ButtonDemo = () => {
  return (
    <div>
      default:
      <div>
        <Button size="xs">Button Text</Button>
        <Button size="sm">Button Text</Button>
        <Button size="md">Button Text</Button>
        <Button size="lg">Button Text</Button>
        <Button size="xl">Button Text</Button>
      </div>
      primaries
      <div>
        <Button style="primary" size="xs">
          Button Text
        </Button>
        <Button style="primary" size="sm">
          Button Text
        </Button>
        <Button style="primary" size="md">
          Button Text
        </Button>
        <Button style="primary" size="lg">
          Button Text
        </Button>
        <Button style="primary" size="xl">
          Button Text
        </Button>
      </div>
      <div className="mt-2">
        <Button disabled style="primary" size="xs">
          Button Text
        </Button>
        <Button disabled style="primary" size="sm">
          Button Text
        </Button>
        <Button disabled style="primary" size="md">
          Button Text
        </Button>
        <Button disabled style="primary" size="lg">
          Button Text
        </Button>
        <Button disabled style="primary" size="xl">
          Button Text
        </Button>
      </div>
      <div className="mt-2">
        <Button style="primary" shape="rounded" size="xs">
          Button Text
        </Button>
        <Button style="primary" shape="rounded" size="sm">
          Button Text
        </Button>
        <Button style="primary" shape="rounded" size="md">
          Button Text
        </Button>
        <Button style="primary" shape="rounded" size="lg">
          Button Text
        </Button>
        <Button style="primary" shape="rounded" size="xl">
          Button Text
        </Button>
      </div>
      <div className="mt-2">
        <Button disabled style="primary" shape="rounded" size="xs">
          Button Text
        </Button>
        <Button disabled style="primary" shape="rounded" size="sm">
          Button Text
        </Button>
        <Button disabled style="primary" shape="rounded" size="md">
          Button Text
        </Button>
        <Button disabled style="primary" shape="rounded" size="lg">
          Button Text
        </Button>
        <Button disabled style="primary" shape="rounded" size="xl">
          Button Text
        </Button>
      </div>
      secondaries
      <div className="mt-2">
        <Button style="secondary" size="xs">
          Button Text
        </Button>
        <Button style="secondary" size="sm">
          Button Text
        </Button>
        <Button style="secondary" size="md">
          Button Text
        </Button>
        <Button style="secondary" size="lg">
          Button Text
        </Button>
        <Button style="secondary" size="xl">
          Button Text
        </Button>
      </div>
      disabled
      <div className="mt-2">
        <Button disabled style="secondary" size="xs">
          Button Text
        </Button>
        <Button disabled style="secondary" size="sm">
          Button Text
        </Button>
        <Button disabled style="secondary" size="md">
          Button Text
        </Button>
        <Button disabled style="secondary" size="lg">
          Button Text
        </Button>
        <Button disabled style="secondary" size="xl">
          Button Text
        </Button>
      </div>
      <div className="mt-2">
        <Button style="secondary" shape="rounded" size="xs">
          Button Text
        </Button>
        <Button style="secondary" shape="rounded" size="sm">
          Button Text
        </Button>
        <Button style="secondary" shape="rounded" size="md">
          Button Text
        </Button>
        <Button style="secondary" shape="rounded" size="lg">
          Button Text
        </Button>
        <Button style="secondary" shape="rounded" size="xl">
          Button Text
        </Button>
      </div>
      disabled
      <div className="mt-2">
        <Button disabled style="secondary" shape="rounded" size="xs">
          Button Text
        </Button>
        <Button disabled style="secondary" shape="rounded" size="sm">
          Button Text
        </Button>
        <Button disabled style="secondary" shape="rounded" size="md">
          Button Text
        </Button>
        <Button disabled style="secondary" shape="rounded" size="lg">
          Button Text
        </Button>
        <Button disabled style="secondary" shape="rounded" size="xl">
          Button Text
        </Button>
      </div>
    </div>
  );
};

export default Button;
