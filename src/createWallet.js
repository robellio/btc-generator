// Importando as dependências
const bip32 = require('bip32');
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');

// Definindo a rede 
const network = bitcoin.networks.testnet;

// Derivação de carteiras HD 
const path = `m/44'/1'/0'/0/0`; 

// Criando o mnemonic para a seed
let mnemonic = bip39.generateMnemonic();
console.log("Mnemonic:", mnemonic);

try {
    // Convertendo mnemonic para seed
    let seed = bip39.mnemonicToSeedSync(mnemonic); 
    console.log("Seed:", seed.toString('hex'));

    // Criando a raiz da carteira HD
    let root = bip32.fromSeed(seed, network);
    console.log("Root Key:", root.toBase58());

    // Criando uma conta - pvt-pub Keys
    let account = root.derivePath(path);
    console.log("Account Key:", account.toBase58());

    // Derivando a chave do nó 
    let node = account.derive(0).derive(0);
    console.log("Node Key:", node.toBase58());
    console.log("Public Key:", node.publicKey.toString('hex'));

    console.log("Public Key Length:", node.publicKey.length);

    // Gerando o endereço
    let payment = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: network,
    });

    console.log("Payment Object:", payment);
    let btcAddress = payment.address;
    console.log("BTC Address:", btcAddress);

    console.log("==== Carteira gerada ====");
    console.log("Endereço: ", btcAddress);
    console.log("Chave privada:", node.toWIF());
    console.log("Seed:", mnemonic);

} catch(error) {
    console.error("Não foi possível gerar a carteira:", error);
    process.exit(1);
}