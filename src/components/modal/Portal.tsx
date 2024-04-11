import React from "react";
import ReactDOM from "react-dom";

const portalRoot = document.getElementById("modal-root") as HTMLElement;

type PortalProps = {
  children: React.ReactNode;
};

export default class Portal_ extends React.Component<PortalProps> {
  private readonly el: HTMLDivElement;
  constructor(props: PortalProps) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount(): void {
    portalRoot.appendChild(this.el);
  }

  componentWillUnmount(): void {
    portalRoot.removeChild(this.el);
  }

  render(): React.ReactPortal {
    const { children } = this.props;
    return ReactDOM.createPortal(children, this.el);
  }
}
