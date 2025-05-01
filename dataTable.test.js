import { Datatable } from './dataTable.js';

describe('Datatable', () => {
  let datatable;

  beforeEach(() => {
    document.body.innerHTML = `
      <table id="testTable">
        <thead>
          <tr><th>Name</th><th>Age</th></tr>
        </thead>
        <tbody>
          <tr><td>John</td><td>30</td></tr>
          <tr><td>Jane</td><td>25</td></tr>
          <tr><td>Jack</td><td>40</td></tr>
        </tbody>
      </table>
    `;
    datatable = new Datatable('#testTable');
    datatable.parse(); // Parseamos los datos antes de realizar pruebas
  });

  test('parse() debería extraer los datos de la tabla HTML', () => {
    expect(datatable.items).toEqual([
      { id: expect.any(String), values: ['John', '30'] },
      { id: expect.any(String), values: ['Jane', '25'] },
      { id: expect.any(String), values: ['Jack', '40'] },
    ]);
  });

  test('generateUUID() debería generar un ID único', () => {
    const id1 = datatable.generateUUID();
    const id2 = datatable.generateUUID();
    expect(id1).not.toBe(id2);
  });

  test('filterRows() debería filtrar filas basadas en un texto de búsqueda', () => {
    datatable.filterRows('Jane');
    expect(datatable.items).toEqual([
      { id: expect.any(String), values: ['Jane', '25'] }
    ]);
  });

  test('filterRows() debería ser insensible a mayúsculas/minúsculas', () => {
    datatable.filterRows('jane');
    expect(datatable.items).toEqual([
      { id: expect.any(String), values: ['Jane', '25'] }
    ]);
  });

  test('filterRows() debería devolver un arreglo vacío si no hay coincidencias', () => {
    datatable.filterRows('Nonexistent');
    expect(datatable.items).toEqual([]);
  });
});