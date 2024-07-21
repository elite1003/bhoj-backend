export const getProfile = (req, res, next) => {
  delete req.user.password;
  return res.status(200).json(req.user);
};

export const deleteProfile = (req, res, next) => {
  req.user
    .destroy()
    .then(() => res.status(200).json("user deleted successfully"))
    .catch(() =>
      res.status(500).json("Internal server error. Deletion of user failed")
    );
};

export const putProfile = (req, res, next) => {
  const userDetail = req.body;
  for (let key in userDetail) {
    req.user[key] = userDetail[key];
  }
  req.user
    .save()
    .then(() => res.status(200).json("user detail updated successfully"))
    .catch(() =>
      res.status(500).json("Internal server error. User detail updation failed")
    );
};
