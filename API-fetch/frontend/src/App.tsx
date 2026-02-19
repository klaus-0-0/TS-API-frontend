import axios from "axios";
import { useEffect, useState } from "react";
import down from "./assets/down.png"

type Artwork = {
  id: number;
  title: string;
  place_of_origin: string | null;
  artist_display: string;
  inscriptions: string | null;
  date_start: number | null;
  date_end: number | null;
};

type Pagination = {
  total: number;
};

type ArtApiResponse = {
  data: Artwork[];
  pagination: Pagination;
};

function App() {
  const [data, setData] = useState<Artwork[]>([]);
  const [page, setPage] = useState<number | null>();
  const [nextButton, setNextButton] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [message, setMessage] = useState<string>("");
  const [checkBox, setCheckbox] = useState<number[]>([]);
  const [allCheckbox, setAllCheckbox] = useState<number[]>([]);
  const [checkboxTrue, setCheckboxTrue] = useState<boolean>(false);
  const [showInputBox, setShowInputBox] = useState<boolean>(false);
  const [rowValue, setRowValue] = useState<string>("");
  const [rowValueSelect, setRowValueSelect] = useState<number[]>([]);
  const API = `https://api.artic.edu/api/v1/artworks?page=${currentPage}`;

  useEffect(() => {

    console.log("C = ", checkBox);
    console.log("C = ", allCheckbox);
    console.log("row = ", rowValueSelect);

  }, [checkBox, allCheckbox, rowValueSelect]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get<ArtApiResponse>(API);
      setData(res.data.data);
      setPage(res.data.pagination.total);
      setNextButton([1, 2, 3, 4]);
      console.log(res);
    };

    fetchData();
  }, [currentPage, API]);

  const handleNextButton = () => {
    const i = 0;
    if (i !== page) {
      setCurrentPage(prev => prev + 1);
    }
    else {
      setMessage("you have reached the end")
    }
  }
  const handlePreviosButton = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }

  const handleCheckBoxTrue = () => {
    data.forEach((val) => {
      setAllCheckbox(prev => [...prev, val.id]);
    });
    setCheckboxTrue(prev => !prev);

  }
  const handleShowInputBox = () => {
    setShowInputBox(prev => !prev);
  }
  const handlerowValue = () => {
    console.log("ok");

    const num = Number(rowValue);
    console.log("num = ", num.valueOf);

    const selectId = data.slice(0, num).map(val => val.id);
    setRowValueSelect(selectId);
    console.log(selectId);

  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {message}
      {data.length > 0 ? (
        <>
          {/* Header (Desktop only) */}
          <div className="hidden md:grid grid-cols-7 gap-2 font-semibold border-b pb-2">
            <div className="flex gap-2 justify-center items-center">
              <input
                type="checkbox"
                onClick={handleCheckBoxTrue}
                className="h-5 w-5"
              />
              <button
                onClick={handleShowInputBox}
                className="cursor-pointer text-gray-700"
              >
                <img src={down} className="h-4 w-4" />
              </button>
            </div>
            <span>Title</span>
            <span>Origin</span>
            <span>Artist</span>
            <span>Inscriptions</span>
            <span>Start</span>
            <span>End</span>
          </div>

          {/* Select rows popup */}
          {showInputBox && (
            <div className="absolute top-16 left-4 z-50 w-64 border rounded bg-white shadow-lg p-3 space-y-3">
              <p className="text-sm font-medium text-gray-700">
                Select multiple rows
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="flex-1 border rounded px-2 py-1"
                  placeholder="Enter value"
                  onChange={(e) => setRowValue(e.target.value)}
                />
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={handlerowValue}
                >
                  Select
                </button>
              </div>
            </div>
          )}

          {/* Rows */}
          <div className="mt-4 space-y-3">
            {data.map((art) => (
              <div
                key={art.id}
                className="border p-3 rounded grid grid-cols-1 gap-2 md:grid-cols-7 md:gap-4"
              >
                {/* Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      checkboxTrue
                        ? allCheckbox.includes(art.id)
                        : checkBox.includes(art.id) ||
                        rowValueSelect.includes(art.id)
                    }
                    onChange={() =>
                      setCheckbox((prev) =>
                        prev.includes(art.id)
                          ? prev.filter((id) => id !== art.id)
                          : [...prev, art.id]
                      )
                    }
                  />
                </div>

                {/* Title */}
                <div className="flex gap-2 md:block">
                  <span className="md:hidden font-semibold">Title:</span>
                  <p className="truncate">{art.title}</p>
                </div>

                {/* Origin */}
                <div className="flex gap-2 md:block">
                  <span className="md:hidden font-semibold">Origin:</span>
                  <p>{art.place_of_origin ?? "Unknown"}</p>
                </div>

                {/* Artist */}
                <div className="flex gap-2 md:block">
                  <span className="md:hidden font-semibold">Artist:</span>
                  <p className="line-clamp-2">{art.artist_display}</p>
                </div>

                {/* Inscriptions */}
                <div className="flex gap-2 md:block">
                  <span className="md:hidden font-semibold">Inscriptions:</span>
                  <p className="line-clamp-2">
                    {art.inscriptions ?? "n/a"}
                  </p>
                </div>

                {/* Start */}
                <div className="flex gap-2 md:block">
                  <span className="md:hidden font-semibold">Start:</span>
                  <p>{art.date_start ?? "-"}</p>
                </div>

                {/* End */}
                <div className="flex gap-2 md:block">
                  <span className="md:hidden font-semibold">End:</span>
                  <p>{art.date_end ?? "-"}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap justify-center md:justify-end gap-2 mt-6">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={handlePreviosButton}
            >
              Previous
            </button>

            {nextButton.map((val, idx) => (
              <button
                key={idx}
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setCurrentPage(val)}
              >
                {val}
              </button>
            ))}

            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={handleNextButton}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        /* Loader */
        <div className="flex justify-center items-center">
          <p className="text-gray-900 text-lg">Loading artworks...</p>
        </div>
      )}

    </div>
  );
}

export default App;
