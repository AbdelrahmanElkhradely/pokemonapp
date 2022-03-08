import React, { createContext, PureComponent } from "react";

const ModalContext = createContext({
  component: null,
  props: {},
  showModal: () => {},
  hideModal: () => {}
});

export class ModalProvider extends PureComponent {
  showModal = (component, props = {}) => {
    let { modals } = this.state;
    modals.push({ component, props });

    this.setState({
      modals: modals.map(c => c)
    });
  };

  hideModal = (index = this.state.modals.length) => {
    this.setState({
      modals: this.state.modals.filter((c, i) => i !== index)
    });
  };

  state = {
    modals: []
  };

  render() {
    return (
      <ModalContext.Provider
        value={{
          ...this.state,
          showModal: this.showModal,
          hideModal: this.hideModal
        }}
      >
        {this.props.children}
      </ModalContext.Provider>
    );
  }
}
export const ModalConsumer = ModalContext.Consumer;
