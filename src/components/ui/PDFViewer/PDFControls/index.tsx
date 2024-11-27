import { ArrowBack, ArrowForward } from '@mui/icons-material';

type PDFControlsProps = {
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  numPages: number;
};

const PDFControls = ({ props }: { props: PDFControlsProps }) => {
  const { pageNumber, setPageNumber, numPages } = props;

  return (
    <>
      <button
        type="button"
        disabled={pageNumber <= 1}
        onClick={() => setPageNumber(pageNumber - 1)}
      >
        <ArrowBack
          className={pageNumber <= 1 ? 'text-gray-300' : 'text-black'}
        />
      </button>
      <span>
        Page {pageNumber} of {numPages}
      </span>
      <button
        type="button"
        disabled={pageNumber >= (numPages ?? 1)}
        onClick={() => setPageNumber(pageNumber + 1)}
      >
        <ArrowForward
          className={
            pageNumber >= (numPages ?? 1) ? 'text-gray-300' : 'text-black'
          }
        />
      </button>
    </>
  );
};

export default PDFControls;
