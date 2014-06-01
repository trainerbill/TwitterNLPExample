# TwitterNLPExample

"Example for interview"

#Dependencies
1.  Java JDK
2.  Stanford NLP
3.  Build Essentials
4.  MongoDB http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/

# Ubuntu Installation
```sh
sudo apt-get install openjdk-6-jdk
sudo apt-get install build-essential

export JAVA_HOME=/usr/lib/jvm/java-6-openjdk-amd64
git clone https://github.com/trainerbill/TwitterNLPExample.git
cd TwitterNLPExample
npm install
wget http://nlp.stanford.edu/software/stanford-corenlp-full-2014-01-04.zip
unzip stanford-corenlp-full-2014-01-04.zip
cp -r stanford-corenlp-full-2014-01-04/* node_modules/stanford-simple-nlp/jar
rm -rf stanford-corenlp-full-2014-01-04.zip stanford-corenlp-full-2014-01-04
```

