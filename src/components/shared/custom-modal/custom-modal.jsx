import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

const CustomModal = ({ children, name, isOpen, closeModal }) => (
  <ReactModal
    style={{
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: '30',
      },
    }}
    isOpen={isOpen}
    contentLabel={name}
    ariaHideApp={false}
    bodyOpenClassName="touch-none"
    className="border-gray-15 relative left-1/2 top-1/2 max-h-[95%] w-[95%] max-w-[466px] -translate-x-1/2 -translate-y-1/2 rounded-[10px] border bg-black text-white shadow-[0px_14px_56px_0px_rgba(0,229,153,0.12),0px_6px_10px_0px_rgba(0,0,0,0.25)] after:absolute after:-inset-px after:rounded-[10px] after:bg-[linear-gradient(245deg,rgba(0,229,153,0.08)0%,rgba(0,229,153,0.5)100%)] after:p-px focus:outline-none"
    shouldCloseOnOverlayClick
    onRequestClose={closeModal}
  >
    {children}
  </ReactModal>
);

CustomModal.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default CustomModal;
