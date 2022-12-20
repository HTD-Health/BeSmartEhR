const calculatePagesCount = (total: number, recordsPerPage: number): number => {
    const pages = Math.floor(total / recordsPerPage);
    return total % recordsPerPage ? pages + 1 : pages;
};

export default calculatePagesCount;
