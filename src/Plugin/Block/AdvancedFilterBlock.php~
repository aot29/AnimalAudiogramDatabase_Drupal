<?php

namespace Drupal\audiogrambase\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Filter' Block for the audiogram browse page.
 *
 * @Block(
 *   id = "filter_block",
 *   admin_label = @Translation("Filter"),
 *   category = @Translation("Filter"),
 * )
 */

class FilterBlock extends BlockBase {
    protected $twig;
    const allowed_tags = [
        'div', 'a'
    ];
    #const API_URL = 'http://hip-data-exchange.test.code.naturkundemuseum.berlin/api/v1/';
    #const BASE_URL = 'http://hip-data-exchange.test.code.naturkundemuseum.berlin';
    const API_URL = 'http://localhost:9090/api/v1/';
    
    // this is called first then call constructor 
    public function create(ContainerInterface $container) {
        $this->twig = $container->get('twig');
    }

    /**
     * {@inheritdoc}
     */
    public function build() {        
        $content = "<div id='filters'></div><div><a href='/advanced'>Advanced</a></div>";
        $renderable = [
            '#markup' => $content,
            '#allowed_tags' => self::allowed_tags
        ];
        return $renderable;
    }
}
