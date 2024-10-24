import { ArrowBack, ArrowForward } from "@mui/icons-material";

type PDFControlsProps = {
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  numPages: number;
  chapterId: string;
};

const PDFControls = ({ props }: { props: PDFControlsProps }) => {
  const { pageNumber, setPageNumber, numPages, chapterId } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setPageNumber(parseInt(value));
    } else {
      setPageNumber(1);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={pageNumber <= 1}
        onClick={() => setPageNumber(pageNumber - 1)}
      >
        <ArrowBack className={pageNumber <= 1 ? "text-gray-300" : "text-black"} />
      </button>
      <span>
        {" "}
        Page{" "}
        <input
          className="w-5 text-center"
          id={`${chapterId}-pgNum-${pageNumber}`}
          type="text"
          value={pageNumber || ""}
          onChange={handleChange}
        ></input>{" "}
        of {numPages}{" "}
      </span>
      <button
        type="button"
        disabled={pageNumber >= (numPages ?? 1)}
        onClick={() => setPageNumber(pageNumber + 1)}
      >
        <ArrowForward className={pageNumber >= (numPages ?? 1) ? "text-gray-300" : "text-black"} />
      </button>
    </>
  );
};

export default PDFControls;
