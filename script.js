/* HW3 – Interactive Dynamic Table
Name: Lisette Perez
Email: Lisette_Perez@student.uml.edu
Date: 10-27-25
Description: Creating an Interactive Dynamic Table using JavaScript, 
it's dynamically based on parameters entered in an HTML form
*/


/* Helpers */
const $ = (sel) => document.querySelector(sel); // convenience selector

const withinRange = (n) => Number.isInteger(n) && n >= -50 && n <= 50;

/* DOM refs */
const form = $('#table-form'); // form element
const wrap = $('#table-wrap'); // conteiner to put table
const msgs = $('#messages'); // inline messages div
const clearBtn = $('#clear'); // clear button

/* Inline status text(no alert())*/
function showMessage(text, type = 'notice') {
  msgs.innerHTML = `<div class="msg ${type}">${text}</div>`;
}
function clearMessage() { msgs.innerHTML = ''; }

/* Build the multiplication table as a single HTML string (fast) */
function buildTable(hStart, hEnd, vStart, vEnd) {
  // Determine ranges (inclusive)
  const hLo = Math.min(hStart, hEnd);
  const hHi = Math.max(hStart, hEnd);
  const vLo = Math.min(vStart, vEnd);
  const vHi = Math.max(vStart, vEnd);

  const cols = hHi - hLo + 1; // number of column value headers
  const rows = vHi - vLo + 1; // number of row value headers

  // Guard against absurd sizes (avoid freezes)
  if (cols * rows > 5000) {
    throw new Error('Table too large. Please use smaller ranges (product of rows × columns must be ≤ 5000).');
  }
  
  // Start table wit THEAD (corner + column labels)
  let html = '<table><thead><tr>';
  // Top-left corner cell
  html += `<th class="corner"></th>`;
  // Top header cells
  for (let x = hLo; x <= hHi; x++) {
    html += `<th>${x}</th>`;
  }
  html += '</tr></thead><tbody>';

  // Body rows (first cell in each row is sticky-left header)
  for (let y = vLo; y <= vHi; y++) {
    html += '<tr>';
    html += `<th class="sticky-left">${y}</th>`;
    for (let x = hLo; x <= hHi; x++) {
      html += `<td>${x * y}</td>`;
    }
    html += '</tr>';
  }

  html += '</tbody></table>';
  return html;
}

/* Submit handler */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearMessage();

  // Parse integers
  const hStart = parseInt($('#hStart').value, 10);
  const hEnd   = parseInt($('#hEnd').value, 10);
  const vStart = parseInt($('#vStart').value, 10);
  const vEnd   = parseInt($('#vEnd').value, 10);

  const errs = [];

  // Basic presence & integer checks
  [['Column Start', hStart], ['Column End', hEnd],
   ['Row Start', vStart], ['Row End', vEnd]].forEach(([label, val]) => {
     if (!Number.isFinite(val) || !Number.isInteger(val)) {
       errs.push(`${label}: please enter an integer.`);
     } else if (!withinRange(val)) {
       errs.push(`${label}: value must be between −50 and 50.`);
     }
   });

  if (errs.length) {
    showMessage(`<strong>Please fix the following:</strong><ul><li>${errs.join('</li><li>')}</li></ul>`, 'error');
    wrap.innerHTML = ''; // clear any previous table
    return;
  }

  // Notice if any start/end were reversed (we auto-swap)
  const notices = [];
  if (hStart > hEnd) notices.push('Horizontal range swapped (start > end).');
  if (vStart > vEnd) notices.push('Vertical range swapped (start > end).');
  if (notices.length) showMessage(notices.join(' '), 'notice'); else clearMessage();

  // Build & inject table
  try {
    const tableHTML = buildTable(hStart, hEnd, vStart, vEnd);
    wrap.innerHTML = tableHTML;
  } catch (err) {
    showMessage(err.message, 'error');
    wrap.innerHTML = '';
  }
});

/* Clear button*/
clearBtn.addEventListener('click', () => {
  form.reset();
  clearMessage();
  wrap.innerHTML = '';
});
