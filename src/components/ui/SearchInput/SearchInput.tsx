import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../../lib/constants";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchStore } from "../../../lib/store";

const SearchInput = () => {
  const search = useSearchStore((state) => state.search);
  const setSearch = useSearchStore((state) => state.setSearch);
  return (
    <>
      <Search>
        <SearchIconWrapper>
          <SearchIcon
            sx={{
              fill: "darkorange",
            }}
          />
        </SearchIconWrapper>
        <StyledInputBase
          id="search"
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Search>
    </>
  );
};

export default SearchInput;
