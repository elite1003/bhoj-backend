export const getAddresses = (req, res, next) => {
  req.user
    .getAddresses()
    .then((addresses) => res.status(200).json(addresses))
    .catch((error) => res.status(500).json(error));
};
export const postAddress = (req, res, next) => {
  const address = req.body;
  req.user
    .createAddress(address)
    .then((address) => res.status(200).json(address))
    .catch((error) => res.status(500).json(error));
};
