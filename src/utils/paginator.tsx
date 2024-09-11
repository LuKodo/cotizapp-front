import { useState } from 'react';

interface iButton {

}

interface PaginatorProps<T> {
  data: T[];
  itemsPerPage: number;
  columns: [string, keyof T][];
  deleteItem: (id: number) => void;
  setSelected: React.Dispatch<React.SetStateAction<T | undefined>>;
  showModal: React.Dispatch<React.SetStateAction<boolean>>
  additionalButtons?: iButton[]
}

const Paginator = <T,>({ data, itemsPerPage, columns, deleteItem, setSelected, showModal }: PaginatorProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="table-responsive border rounded-4">
      <table className="table text-nowrap mb-0 align-middle">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column[0]}</th>
            ))}
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {selectedData.map((item) => (
            <tr key={item['id' as keyof T] as React.Key}>
              {columns.map((column, index) => (
                <td key={index}>{String(item[column[1]])}</td>
              ))}
              <td>
                <div className="btn-group">
                  <button className='btn btn-light'
                    onClick={() => { setSelected(item); showModal(true) }}
                  >
                    <i className="bi bi-pencil-fill text-info" />
                  </button>

                  <button className='btn btn-light'
                    onClick={() => deleteItem(item['id' as keyof T] as number)}>
                    <i className="bi bi-trash-fill text-danger" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='d-flex justify-content-between'>
        <button className='btn btn-info' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          <i className="bi bi-chevron-left" />
        </button>
        <span>{`Página ${currentPage} de ${totalPages}`}</span>
        <button className='btn btn-info' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </div>
  );
};

export default Paginator;
