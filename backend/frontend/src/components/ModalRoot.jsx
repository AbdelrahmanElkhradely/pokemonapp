import React from "react";
import { ModalConsumer } from "../context/ModalContext";

const ModalRoot = () => (
  <ModalConsumer>
    {({ modals, hideModal }) =>
      modals.length
        ? modals.map(({ component: Component, props }, index) => (
            <Component
              key={index}
              ariaHideApp={false}
              {...props}
              onRequestClose={() => hideModal(index)}
              transparent={true} 
              size="lg"
              
            />
          ))
        : null
    }
  </ModalConsumer>
);

export default ModalRoot;
