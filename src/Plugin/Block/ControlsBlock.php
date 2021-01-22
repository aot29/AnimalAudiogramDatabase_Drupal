<?php

namespace Drupal\audiogrambase\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Controls' Block for the audiogram details page.
 *
 * @Block(
 *   id = "controls_block",
 *   admin_label = @Translation("Controls"),
 *   category = @Translation("Controls"),
 * )
 */

class ControlsBlock extends BlockBase {
    protected $twig;
    const allowed_tags = [
        'div', 'table', 'tr', 'th', 'td', 'script', 'link', 'input', 'label'
    ];
    #const API_URL = 'http://hip-data-exchange.test.code.naturkundemuseum.berlin/api/v1/';
    #const BASE_URL = 'http://hip-data-exchange.test.code.naturkundemuseum.berlin';
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
           <link rel='stylesheet' type='text/css' href='/modules/custom/audiogrambase/css/controls.css'/>
           <div id='controls'></div>";
        $renderable = [
            '#markup' => $content,
            '#allowed_tags' => self::allowed_tags
        ];
        return $renderable;
    }
}
