<?php

namespace Drupal\audiogrambase\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Summary' Block for the audiogram home page.
 *
 * @Block(
 *   id = "summary_block",
 *   admin_label = @Translation("Summary"),
 *   category = @Translation("Summary"),
 * )
 */

class SummaryBlock extends BlockBase {
    protected $twig;
    const allowed_tags = [
        'div', 'table', 'tr', 'th', 'td', 'script', 'link', 'a'
    ];
    #const API_URL = '/api/v1/'; # must be relative URL to avoid mixed content errors
    const API_URL = 'http://localhost:9082/api/v1/';
    
    // this is called first then call constructor 
    public function create(ContainerInterface $container) {
        $this->twig = $container->get('twig');
    }

    /**
     * {@inheritdoc}
     */
    public function build() {        
        $content = "
           <link rel='stylesheet' type='text/css' href='/modules/custom/audiogrambase/css/summary.css'/>
           <script src='/modules/custom/audiogrambase/js/utils.js'></script>
           <script src='/modules/custom/audiogrambase/js/API_Client.js'></script>
           <script>
             /** The API cient for this page*/
             var api = new API_Client('".self::API_URL."');
           </script>
           <script src='/modules/custom/audiogrambase/js/summary.js'></script>
           <div id='summary'></div>";
        $renderable = [
            '#markup' => $content,
            '#allowed_tags' => self::allowed_tags
        ];
        return $renderable;
    }
}
