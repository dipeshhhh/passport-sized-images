import React, { useRef } from 'react';
import '../Dialog.css';
import './CustomSizeDialog.css';

// Helper function to validate input as a number
const validateNumber = (e) => {
  const input = e.target;
  // Replace any non-digit characters except for the dot
  input.value = input.value.replace(/[^\d.]/g, '');
  // Ensure there is only one dot
  input.value = input.value.replace(/(\..*)\./g, '$1');
  // Ensure that if the value starts with a dot, it is replaced with '0.'
  input.value = input.value.replace(/^\./, '0.');
  // Ensure that if the value starts with multiple zeros, they are replaced with a single zero
  input.value = input.value.replace(/^0+(?=\d)/, '0');
  // Ensure that if the value contains leading zeros, they are removed
  input.value = input.value.replace(/^0+(\d)/, '$1');
}

function SizeInput({ label, inputRef, unitRef }) {
  return (
    <div className='custom-image-size-input'>
      <label className='custom-image-size-input-label'>{label}</label>
      <input type='text' className='custom-image-size-input-input' onChange={validateNumber} ref={inputRef} />
      <select className='custom-image-size-input-unit' ref={unitRef}>
        <option value='cm'>cm</option>
        <option value='inch'>inch</option>
        <option value='px'>px</option>
      </select>
    </div>
  )
}

function CustomSizeDialog({ referrer, selectorRef, title, sizes, setSizes, selectedSize, setSelectedSize, cmToPx, inchToPx }) {
  const widthInputRef = useRef(null);
  const widthUnitRef = useRef(null);
  const heightInputRef = useRef(null);
  const heightUnitRef = useRef(null);

  const addCustomImageSize = () => {
    const width = widthInputRef.current.value;
    const height = heightInputRef.current.value;
    const widthUnit = widthUnitRef.current.value;
    const heightUnit = heightUnitRef.current.value;

    const unitConversionMap = { // Convert to pixels
      'inch': inchToPx,
      'cm': cmToPx,
      'px': (val) => { return val }
    }

    if ((width === '' || height === '') || (Number.parseFloat(width) <= 0 || Number.parseFloat(height) <= 0)) {
      //! For future: replace alert with a toast.
      alert('Enter a valid number: width and height must be greater than 0');
      return;
    }
    else {
      const widthInPx = unitConversionMap[widthUnit](Number.parseFloat(width));
      const heightInPx = unitConversionMap[heightUnit](Number.parseFloat(height));
      const customSize = {
        name: `${width}${widthUnit} x ${height}${heightUnit}`,
        width: widthInPx,
        height: heightInPx
      }
      setSelectedSize(customSize);
      setSizes([customSize, ...sizes]);
      // setSizes([...sizes, customSize]); //? Why is this not working?
      selectorRef.current.value = customSize.name;
      referrer.current.close();
    }
  }

  const closeDialog = () => {
    referrer.current.close();
    // Set the selector back to the previously selected image size
    // I think this condition check is not necessary since currrent.value will be 'custom' if we are in this dialog, but I'll keep it for now
    if (`${selectorRef.current.value}`.toLowerCase() === 'custom') selectorRef.current.value = selectedSize.name;
  }

  return (
    <dialog className="dialog custom-image-size-dialog" ref={referrer}>
      <div method='dialog'>
        <div className='dialog-text'>
          <h5 className='dialog-title'>{`${title}`}</h5>
          <form className='custom-image-size-inputs'>
            <SizeInput label='Width' inputRef={widthInputRef} unitRef={widthUnitRef} />
            <SizeInput label='Height' inputRef={heightInputRef} unitRef={heightUnitRef} />
          </form>
        </div>
        <div className='dialog-buttons'>
          <button className='dialog-button cancel-button' onClick={closeDialog} autoFocus>Cancel</button>
          <button className='dialog-button confirm-button' onClick={addCustomImageSize}>Confirm</button>
        </div>
      </div>
    </dialog>
  )
}

// CustomSizeDialog.propTypes = {
//   referrer: React.PropTypes.object,
//   selectorRef: React.PropTypes.object,
//   title: React.PropTypes.string,
//   sizes: React.PropTypes.array,
//   setSizes: React.PropTypes.func,
//   selectedSize: React.PropTypes.object,
//   setSelectedSize: React.PropTypes.func,
//   cmToPx: React.PropTypes.func,
//   inchToPx: React.PropTypes.func
// }

export default CustomSizeDialog;