library(fs)

dirs <- fs::dir_ls(type = "directory")
dirs <- setdiff(dirs, "index_files")

zip_dir <- function(x) {
  zip(zipfile = x, dir(x, full.names = TRUE))
}

# Delete existing zips
zips <- path(dirs, ext = "zip")
zips <- zips[file_exists(zips)]
file_delete(zips)

tmp <- lapply(dirs, zip_dir)
