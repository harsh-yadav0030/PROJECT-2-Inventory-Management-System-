export const getPagination = (req,res)=>{
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(
        Math.max(parseInt(req.query.limit) || 10, 1),
        100
    );
    return {
        page,
        limit,
        skip: (page - 1) * limit,
    };
};
export const getPaginationMeta = (page, limit, totalItems) => {

    return {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
    };
};