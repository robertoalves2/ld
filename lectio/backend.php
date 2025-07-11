<?php
header('Content-Type: application/json; charset=UTF-8');

function getFirstItem($feedUrl) {
    $xml = @simplexml_load_file($feedUrl);
    if (!$xml || !isset($xml->channel->item[0])) return null;
    $item = $xml->channel->item[0];
    return [
        'title' => (string) $item->title,
        'link'  => (string) $item->link
    ];
}

function extractEvangelhoToEnd($url) {
    $html = @file_get_contents($url);
    if (!$html) return null;

    libxml_use_internal_errors(true);
    $doc = new DOMDocument();
    $doc->loadHTML($html);
    libxml_clear_errors();

    $xpath = new DOMXPath($doc);
    $nodes = $xpath->query("//*[contains(translate(text(), 'EVANGELHO', 'evangelho'), 'evangelho')]");
    if ($nodes->length === 0) return null;

    $startNode = $nodes->item(0);
    $content = "<h2>" . htmlspecialchars(trim($startNode->textContent)) . "</h2>";

    $container = $startNode->parentNode;
    $sibling = $container->nextSibling;

    while ($sibling) {
        if ($sibling->nodeType === XML_ELEMENT_NODE || $sibling->nodeType === XML_TEXT_NODE) {
            $content .= $doc->saveHTML($sibling);
        }
        $sibling = $sibling->nextSibling;
    }

    return $content;
}

// Execução principal
$feedUrl = "https://aliturgia.com/feed/";
$feedData = getFirstItem($feedUrl);

if (!$feedData) {
    echo json_encode(['erro' => 'Não foi possível obter o post do feed.']);
    exit;
}

$evangelho = extractEvangelhoToEnd($feedData['link']);

if (!$evangelho) {
    echo json_encode(['erro' => 'Evangelho não encontrado.']);
    exit;
}

// Retorna JSON com título e conteúdo
echo json_encode([
    'titulo'    => $feedData['title'],
    'evangelho' => $evangelho
]);
