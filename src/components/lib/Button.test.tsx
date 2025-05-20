import { render } from "@testing-library/react";
import Button from "./Button";

describe(Button.name, () => {
  it("should take a snapshot", () => {
    const clickHandler = jest.fn();

    const { asFragment } = render(
      <Button onClick={clickHandler}>click me</Button>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
