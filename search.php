<?php
function extractTitle($content) {
    if (preg_match("/<title>(.*?)<\/title>/is", $content, $matches)) {
        return trim($matches[1]);
    }
    return "Untitled Page";
}

function extractSnippet($content, $query, $length = 150) {
    $pos = stripos($content, $query);
    if ($pos !== false) {
        $start = max(0, $pos - ($length / 2));
        $snippet = substr($content, $start, $length);
        return "..." . trim($snippet) . "...";
    }
    return "";
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["query"])) {
    $query = strtolower(trim($_POST["query"]));
    $searchDir = "./"; // adjust if HTML files are elsewhere
    $htmlFiles = [];
    $directory = new RecursiveDirectoryIterator($searchDir);
    $iterator = new RecursiveIteratorIterator($directory);
    foreach ($iterator as $file) {
        if ($file->isFile() && strtolower($file->getExtension()) === 'html') {
            $htmlFiles[] = $file->getPathname();
        }
    }


    $results = [];

    foreach ($htmlFiles as $file) {
        $rawContent = file_get_contents($file);
        $plainText = strtolower(strip_tags($rawContent));

        if (stripos($plainText, $query) !== false) {
            $filename = basename($file);
            $title = extractTitle($rawContent);
            $snippet = extractSnippet($plainText, $query);
            $relativePath = str_replace($searchDir, '', $file);
            $cleanPath = str_replace(".html", "", $relativePath);
            $url = "https://metslab.uk/" . ltrim($cleanPath, "/\\");

            $results[] = [
                "title" => $title,
                "url" => $url,
                "snippet" => $snippet
            ];
        }
    }

    if (!empty($results)) {
        echo "<ul>";
        foreach ($results as $result) {
            echo "<li style='margin-bottom: 20px;'>";
            echo "<div style='font-size: 18px; font-weight: bold;'>" . htmlspecialchars($result['title']) . "</div>";
            echo "<div style='color: green; margin-bottom: 5px;'><a href='{$result['url']}' target='_blank'>{$result['url']}</a></div>";
            echo "<div style='color: #444; font-size: 14px;'>" . htmlspecialchars($result['snippet']) . "</div>";
            echo "</li>";
        }
        echo "</ul>";
    } else {
        echo "<p>No results found for <strong>" . htmlspecialchars($query) . "</strong>.</p>";
    }
}
?>
