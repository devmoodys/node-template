import React from "react";
import { shallow } from "enzyme";

import { Flash } from "../Flash";

describe("Flash", () => {
  describe("when _NOT_ given a `type` property", () => {
    it("returns nothing", () => {
      const component = shallow(<Flash message="huzzzah" />);
      expect(component.at(0).children()).toHaveLength(0);
    });
  });

  describe("when _NOT_ given a `message` property", () => {
    it("returns nothing", () => {
      const component = shallow(<Flash type="no-such-type" />);
      expect(component.at(0).children()).toHaveLength(0);
    });
  });

  describe("given a type and message", () => {
    const type = "a-type";
    const message = "foo bar baz";

    it("sets the style to match the type", () => {
      const component = shallow(<Flash type={type} message={message} />);
      expect(component.props().className).toMatch(/Flash--a-type/);
    });

    it("displays the message", () => {
      const text = shallow(<Flash type={type} message={message} />).text();
      expect(text).toMatch(new RegExp(`${message}`));
    });
  });
});
