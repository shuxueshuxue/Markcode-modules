#module #haskell 

```haskell
-- !
module Here
    ( Showable(..)
    , appendHere
    , getOutputFilename
    ) where

import System.FilePath (takeBaseName, replaceExtension)
import System.Environment (getProgName)

class Showable a where
    toString :: a -> String

instance Showable String where
    toString = id

instance Showable Int where
    toString = show

instance Showable Integer where
    toString = show

instance Showable Double where
    toString = show

instance Showable Bool where
    toString = show

-- Add more instances as needed

appendHere :: Showable a => a -> IO FilePath
appendHere obj = do
    outputFile <- getOutputFilename
    appendFile outputFile ("\n" ++ toString obj)
    return outputFile

getOutputFilename :: IO FilePath
getOutputFilename = do
    mainScriptName <- getProgName
    let baseName = takeBaseName mainScriptName
    return $ replaceExtension baseName ".md"

main :: IO ()
main = do
    putStrLn "Successfully extracted."
```

