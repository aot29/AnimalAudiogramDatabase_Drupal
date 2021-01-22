<?php

namespace Drupal\audiogrambase\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Banner' Block for the audiogram details page.
 *
 * @Block(
 *   id = "banner_block",
 *   admin_label = @Translation("Banner"),
 *   category = @Translation("Banner"),
 * )
 */

class BannerBlock extends BlockBase {
    protected $twig;
    const allowed_tags = [
        'style', 'script'
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
        <style type='text/css'>
           #header {
              background-size: cover;
              background-position: center;
              height: 200px;
           }
           .region-primary-menu {
              position: absolute;
              top: 158px;
           }
        </style>
        <script src='/modules/custom/audiogrambase/js/banner.js'></script>
        ";
        $renderable = [
            '#markup' => $content,
            '#allowed_tags' => self::allowed_tags
        ];
        return $renderable;
    }
}
